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

-- Table COUPON
CREATE TABLE "coupon" (
    "id" SERIAL PRIMARY KEY,
    "code" VARCHAR(50) NOT NULL,
    "amount" NUMERIC(10, 2) NOT NULL,
    "status" INT NOT NULL,
    "country_id" INT NOT NULL,
    "wetsuit" TEXT default 'false',
    "user_id" INT,
    FOREIGN KEY ("country_id") REFERENCES "country"("id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id")
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

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "brand" TEXT NOT NULL,
    "facturation_code" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    )

COMMIT;