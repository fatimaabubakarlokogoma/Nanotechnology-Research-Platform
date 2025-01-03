;; Nanotech NFT Contract

(define-non-fungible-token nanotech-design uint)

(define-map nanotech-designs
  { design-id: uint }
  {
    creator: principal,
    title: (string-utf8 100),
    description: (string-utf8 1000),
    patent-status: (string-ascii 20)
  }
)

(define-data-var design-count uint u0)

(define-public (mint-nanotech-nft (title (string-utf8 100)) (description (string-utf8 1000)))
  (let
    (
      (new-design-id (+ (var-get design-count) u1))
    )
    (try! (nft-mint? nanotech-design new-design-id tx-sender))
    (map-set nanotech-designs
      { design-id: new-design-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        patent-status: "pending"
      }
    )
    (var-set design-count new-design-id)
    (ok new-design-id)
  )
)

(define-public (transfer-nanotech-nft (design-id uint) (recipient principal))
  (nft-transfer? nanotech-design design-id tx-sender recipient)
)

(define-public (update-patent-status (design-id uint) (new-status (string-ascii 20)))
  (let
    (
      (design (unwrap! (map-get? nanotech-designs { design-id: design-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get creator design)) (err u403))
    (ok (map-set nanotech-designs
      { design-id: design-id }
      (merge design { patent-status: new-status })
    ))
  )
)

(define-read-only (get-nanotech-design (design-id uint))
  (ok (unwrap! (map-get? nanotech-designs { design-id: design-id }) (err u404)))
)

(define-read-only (get-design-count)
  (ok (var-get design-count))
)

