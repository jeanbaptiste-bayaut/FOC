BEGIN;

-- Table BRAND
CREATE TABLE brand (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

-- Table COUNTRY
CREATE TABLE "country" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "currency" VARCHAR(50) NOT NULL,
    "brand_id" INT NOT NULL,
    FOREIGN KEY ("brand_id") REFERENCES "brand"("id")
);

-- Table USER
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "service" TEXT NOT NULL,
    "role" TEXT NOT NULL
    );

CREATE TABLE "facturation_code" (
    "id" SERIAL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
)

CREATE TABLE "user_has_facturation_code" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "facturation_code_id" INT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    FOREIGN KEY ("facturation_code_id") REFERENCES "facturation_code"("id")
);

-- Table COUPON
CREATE TABLE "coupon" (
    "id" SERIAL PRIMARY KEY,
    "code" VARCHAR(50) NOT NULL,
    "amount" NUMERIC(10, 2) NOT NULL,
    "status" INT NOT NULL,
    "country_id" INT NOT NULL,
    "wetsuit" TEXT default 'false',
    "user_id" INT,
    "facturation_code_id" INT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    FOREIGN KEY ("country_id") REFERENCES "country"("id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    FOREIGN KEY ("facturation_code_id") REFERENCES "facturation_code"("id")
);

-- Table FREESHIPPING
CREATE TABLE "freeshipping" (
    "id" SERIAL PRIMARY KEY,
    "code" VARCHAR(50) NOT NULL,
    "status" INT NOT NULL,
    "country_id" INT NOT NULL,
    "user_id" INT,
    FOREIGN KEY ("country_id") REFERENCES "country"("id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id")
);

ALTER TABLE "coupon"
ADD CONSTRAINT "unique_code_country" UNIQUE ("code", "country_id");

COMMIT;