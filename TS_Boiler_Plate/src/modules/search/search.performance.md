# Search Performance Baseline

## Date

2026-08-04

## Scope

Phase 4 Search & Book backend endpoint: `GET /api/v1/search`.

## Current Query Shape

- One availability-block lookup when `checkIn` and `checkOut` are provided.
- One accommodation-unit paginated query for visible results.
- One accommodation-unit count query for pagination totals.
- One capped accommodation-unit query, limited to 500 records, for map markers and filter counts.
- One holiday-park lookup for map marker coordinates.

## Current Index Support

- `AccommodationUnit`: `parkSlug`, `category`, `isPublished`.
- `AccommodationUnit`: `capacity.maxOccupancy`, `capacity.pets`.
- `AccommodationUnit`: `features.isPetFriendly`, `features.isWheelchairAccessible`, `features.hasWellness`.
- `AvailabilityBlock`: `accommodationUnitSlug`, `startDate`, `endDate`, `isActive`.
- `AvailabilityBlock`: `parkSlug`, `startDate`, `endDate`, `isActive`.

## Baseline Status

No production-sized dataset exists yet, so no timing benchmark has been recorded. The first real benchmark should be captured after Phase 5 seed/rate-plan data exists and after at least 1,000 accommodation units plus 10,000 availability blocks are seeded.

## Initial Guardrail

The filter-count and map aggregation query is capped at 500 matched units to avoid unbounded reads during early development.
