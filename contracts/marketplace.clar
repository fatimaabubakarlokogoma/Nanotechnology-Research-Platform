;; Marketplace Contract

(define-map listings
  { listing-id: uint }
  {
    seller: principal,
    title: (string-utf8 100),
    description: (string-utf8 1000),
    price: uint,
    category: (string-ascii 20)
  }
)

(define-data-var listing-count uint u0)

(define-public (create-listing (title (string-utf8 100)) (description (string-utf8 1000)) (price uint) (category (string-ascii 20)))
  (let
    (
      (new-listing-id (+ (var-get listing-count) u1))
    )
    (map-set listings
      { listing-id: new-listing-id }
      {
        seller: tx-sender,
        title: title,
        description: description,
        price: price,
        category: category
      }
    )
    (var-set listing-count new-listing-id)
    (ok new-listing-id)
  )
)

(define-public (purchase-listing (listing-id uint))
  (let
    (
      (listing (unwrap! (map-get? listings { listing-id: listing-id }) (err u404)))
    )
    (try! (stx-transfer? (get price listing) tx-sender (get seller listing)))
    (map-delete listings { listing-id: listing-id })
    (ok true)
  )
)

(define-public (cancel-listing (listing-id uint))
  (let
    (
      (listing (unwrap! (map-get? listings { listing-id: listing-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get seller listing)) (err u403))
    (map-delete listings { listing-id: listing-id })
    (ok true)
  )
)

(define-read-only (get-listing (listing-id uint))
  (ok (unwrap! (map-get? listings { listing-id: listing-id }) (err u404)))
)

(define-read-only (get-listing-count)
  (ok (var-get listing-count))
)

