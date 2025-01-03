;; Incentive Token Contract

(define-fungible-token nanotech-token)

(define-map user-reputation
  { user: principal }
  { score: uint }
)

(define-constant contract-owner tx-sender)

(define-public (mint-tokens (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ft-mint? nanotech-token amount recipient)
  )
)

(define-public (transfer-tokens (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (try! (ft-transfer? nanotech-token amount sender recipient))
    (ok true)
  )
)

(define-public (reward-peer-review (reviewer principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (try! (ft-mint? nanotech-token amount reviewer))
    (map-set user-reputation
      { user: reviewer }
      { score: (+ (default-to u0 (get score (map-get? user-reputation { user: reviewer }))) u1) }
    )
    (ok true)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance nanotech-token account))
)

(define-read-only (get-reputation (user principal))
  (ok (default-to u0 (get score (map-get? user-reputation { user: user }))))
)

