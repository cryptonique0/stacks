(define-data-var owner principal tx-sender)
(define-map whitelist principal bool)

(define-constant err-not-owner (err u100))

(define-read-only (is-whitelisted (user principal))
  (default-to false (map-get? whitelist user))
)

(define-public (add-to-whitelist (user principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-not-owner)
    (map-set whitelist user true)
    (ok true)
  )
)

(define-public (remove-from-whitelist (user principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-not-owner)
    (map-delete whitelist user)
    (ok true)
  )
)

(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-not-owner)
    (var-set owner new-owner)
    (ok new-owner)
  )
)
