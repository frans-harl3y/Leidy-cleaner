#!/bin/bash

# Convert PostgreSQL migrations to SQLite compatible versions

echo "🔄 Converting PostgreSQL migrations to SQLite..."

MIGRATIONS_DIR="backend/migrations"
SQLITE_DIR="backend/migrations_sqlite"

mkdir -p "$SQLITE_DIR"

# Convert each SQL file
for sql_file in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$sql_file" ]; then
        filename=$(basename "$sql_file")
        output_file="$SQLITE_DIR/$filename"

        echo "Converting $filename..."

        # Convert PostgreSQL syntax to SQLite
        sed \
            -e 's/SERIAL PRIMARY KEY/INTEGER PRIMARY KEY AUTOINCREMENT/g' \
            -e 's/SERIAL/INTEGER/g' \
            -e 's/BOOLEAN/INTEGER/g' \
            -e 's/true/1/g' \
            -e 's/false/0/g' \
            -e 's/CURRENT_TIMESTAMP/datetime('\''now'\'')/g' \
            -e 's/TIMESTAMP/DATETIME/g' \
            -e 's/VARCHAR/TEXT/g' \
            "$sql_file" > "$output_file"
    fi
done

echo "✅ SQLite migrations created in $SQLITE_DIR"