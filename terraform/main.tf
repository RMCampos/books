terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
  }

  backend "s3" {
    bucket                      = "books"
    key                         = "books/kubernetes/terraform.tfstate"
    region                      = "auto"
    endpoints                   = { s3 = "https://d17eb09b6bce2f90e16e30000bb2a6baf9.r2.cloudflarestorage.com" }
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

variable "convex_url" {
  type      = string
  sensitive = true
}

variable "clerk_publishable_key" {
  type      = string
  sensitive = true
}

variable "frontend_image" {
  type    = string
  default = "ghcr.io/rmcampos/books/app:latest"
}

resource "kubernetes_namespace_v1" "books" {
  metadata {
    name = "books"
  }
}

resource "kubernetes_secret_v1" "books_secrets" {
  metadata {
    name      = "books-secrets"
    namespace = kubernetes_namespace_v1.books.metadata[0].name
  }

  data = {
    convex_url            = var.convex_url
    clerk_publishable_key = var.clerk_publishable_key
  }
}

resource "kubernetes_deployment_v1" "books_frontend" {
  metadata {
    name      = "books-frontend"
    namespace = kubernetes_namespace_v1.books.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "books-app" } }
    template {
      metadata { labels = { app = "books-app" } }
      spec {
        container {
          image = var.frontend_image
          name  = "frontend"
          port { container_port = 3000 }
          env {
            name = "VITE_CONVEX_URL"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.books_secrets.metadata[0].name
                key  = "convex_url"
              }
            }
          }
          env {
            name = "VITE_CLERK_PUBLISHABLE_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.books_secrets.metadata[0].name
                key  = "clerk_publishable_key"
              }
            }
          }
          resources {
            limits   = { memory = "256Mi", cpu = "500m" }
            requests = { memory = "128Mi", cpu = "100m" }
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "books_frontend_svc" {
  metadata {
    name      = "books-frontend-svc"
    namespace = kubernetes_namespace_v1.books.metadata[0].name
  }
  spec {
    selector = { app = "books-app" }
    port {
      port        = 3000
      target_port = 3000
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_ingress_v1" "books_ingress" {
  metadata {
    name      = "books-ingress"
    namespace = kubernetes_namespace_v1.books.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class"    = "traefik"
      "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
    }
  }
  spec {
    tls {
      hosts       = ["books.darkroasted.vps-kinghost.net"]
      secret_name = "books-tls-certs"
    }
    rule {
      host = "books.darkroasted.vps-kinghost.net"
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.books_frontend_svc.metadata[0].name
              port { number = 3000 }
            }
          }
        }
      }
    }
  }
}
