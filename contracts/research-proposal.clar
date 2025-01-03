;; Research Proposal Contract

(define-map proposals
  { proposal-id: uint }
  {
    researcher: principal,
    title: (string-utf8 100),
    description: (string-utf8 1000),
    funding-goal: uint,
    current-funding: uint,
    status: (string-ascii 20)
  }
)

(define-map proposal-votes
  { proposal-id: uint, voter: principal }
  { amount: uint }
)

(define-data-var proposal-count uint u0)

(define-public (submit-proposal (title (string-utf8 100)) (description (string-utf8 1000)) (funding-goal uint))
  (let
    (
      (new-proposal-id (+ (var-get proposal-count) u1))
    )
    (map-set proposals
      { proposal-id: new-proposal-id }
      {
        researcher: tx-sender,
        title: title,
        description: description,
        funding-goal: funding-goal,
        current-funding: u0,
        status: "active"
      }
    )
    (var-set proposal-count new-proposal-id)
    (ok new-proposal-id)
  )
)

(define-public (fund-proposal (proposal-id uint) (amount uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
      (new-funding (+ (get current-funding proposal) amount))
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal { current-funding: new-funding })
    )
    (map-set proposal-votes
      { proposal-id: proposal-id, voter: tx-sender }
      { amount: (default-to u0 (get amount (map-get? proposal-votes { proposal-id: proposal-id, voter: tx-sender }))) }
    )
    (ok true)
  )
)

(define-public (change-proposal-status (proposal-id uint) (new-status (string-ascii 20)))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get researcher proposal)) (err u403))
    (ok (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal { status: new-status })
    ))
  )
)

(define-read-only (get-proposal (proposal-id uint))
  (ok (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
)

(define-read-only (get-proposal-count)
  (ok (var-get proposal-count))
)

