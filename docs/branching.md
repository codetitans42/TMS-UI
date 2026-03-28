# Release Flow

1. Build feature branches from `dev`
2. Open pull requests into `dev`
3. Promote validated `dev` changes into `stage`
4. Run regression and release checks in `stage`
5. Promote signed-off `stage` changes into `prod`

Branch protection should require pull requests, CI, and CodeRabbit review on `dev`, `stage`, and `prod`.
