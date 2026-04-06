# Routebase

A full-stack Transportation Management System built from scratch — designed by someone who has spent 5+ years working inside enterprise TMS platforms professionally.

🚧 **Status:** In active development

---

## What It Does

Routebase manages the full order-to-shipment lifecycle for shippers: inbound orders are loaded, consolidated into shipments, assigned to carriers and equipment, and tracked through delivery with a complete event audit trail.

**Current functionality:**
- User authentication with role-based access (admin / user)
- Open orders loading and management
- Order consolidation into shipments with carrier and equipment type assignment
- Shipment status workflow tracking

**Planned:**
- Carrier portal and spot quote workflow
- Live shipment event tracking
- KPI dashboards and reporting
- Customer and supplier self-service views

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT |

---

## Database Design

The schema consists of 13 normalized tables built around the core entities of a real TMS:

```
companies / carriers / customers / suppliers
    ↓
shipper_locations / customer_locations / supplier_locations
    ↓
products / equipment_types
    ↓
orders / order_line_items
    ↓
shipments / shipment_orders (junction) / shipment_events
```

**Key design decisions:**
- **UUID primary keys** via `pgcrypto` — avoids sequential ID exposure and supports eventual multi-region distribution
- **Custom ENUM types** for status workflows (`order_status`, `shipment_status`, `shipment_events_type`) — enforces valid state transitions at the database level
- **Multi-tenant architecture** — `company_id` threads through companies, shipper locations, and products to support multiple shippers in a single instance
- **Junction table** (`shipment_orders`) — models the many-to-many relationship between shipments and orders cleanly, with `order_id` constrained as UNIQUE to prevent double-assignment
- **Shipment event log** — append-only audit trail of all shipment activity (pickup, transit, delivery, comments) with optional user attribution
- **Separation of location types** — shipper locations, customer locations, and supplier locations are kept in distinct tables to reflect real TMS data modeling, where origin/destination logic differs by party type

---

## Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL instance

### Backend
```bash
cd routebase-backend  # or your backend folder name
npm install
cp .env.example .env  # add DATABASE_URL, JWT_SECRET, PORT
psql -d your_db_name -f schema.sql
npm start
```

### Frontend
```bash
cd routebase-frontend
npm install
cp .env.example .env  # set REACT_APP_API_URL
npm start
```

---

## Background

This project came out of direct experience managing logistics operations and implementing enterprise TMS platforms (BluJay/TMS4S, SAP WM) across 44 distribution sites. The schema and feature set reflect real operational requirements — not a tutorial interpretation of what a TMS might look like.

---

## Author

Samuel Brown — [github.com/samuelwbrown4](https://github.com/samuelwbrown4)