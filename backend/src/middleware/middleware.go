package middleware

import (
	"net/http"
	"strings"
)

// case sensitive and also bypass CORS
func CaseSensitiveMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.URL.Path, "/")
		for i, part := range parts {
			if i > 0 && strings.ToLower(parts[i-1]) == "collection" {
				continue
			}
			parts[i] = strings.ToLower(part)
		}

		r.URL.Path = strings.Join(parts, "/")

		reqFrom := r.Header.Get("Origin")
		if reqFrom == "" {
			reqFrom = r.Header.Get("Referer")
		}

		originalReqFrom := reqFrom

		w.Header().Set("Access-Control-Allow-Origin", originalReqFrom) // as it is with http or https
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
