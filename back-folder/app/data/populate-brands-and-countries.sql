BEGIN;

DROP TABLE IF EXISTS "coupon" CASCADE;
DROP TABLE IF EXISTS "freeshipping" CASCADE;
DROP TABLE IF EXISTS "country", "brand";

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
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
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

INSERT INTO "brand" ("name") VALUES ('quiksilver');
INSERT INTO "brand" ("name") VALUES ('roxy');
INSERT INTO "brand" ("name") VALUES ('dcshoes');
INSERT INTO "brand" ("name") VALUES ('billabong');
INSERT INTO "brand" ("name") VALUES ('element');
INSERT INTO "brand" ("name") VALUES ('rvca');

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('france', 'FR', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('france', 'FR', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('france', 'FR', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('france', 'FR', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('france', 'FR', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('france', 'FR', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('spain', 'ES', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('spain', 'ES', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('spain', 'ES', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('spain', 'ES', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('spain', 'ES', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('spain', 'ES', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('germany', 'DE', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('germany', 'DE', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('germany', 'DE', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('germany', 'DE', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('germany', 'DE', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('germany', 'DE', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('switzerland', 'CH', 'CHF',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('switzerland', 'CH', 'CHF',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('switzerland', 'CH', 'CHF',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('switzerland', 'CH', 'CHF',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('switzerland', 'CH', 'CHF',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('switzerland', 'CH', 'CHF',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('england', 'UH', 'GBP',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('england', 'UH', 'GBP',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('england', 'UH', 'GBP',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('england', 'UH', 'GBP',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('england', 'UH', 'GBP',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('england', 'UH', 'GBP',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('italy', 'IT', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('italy', 'IT', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('italy', 'IT', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('italy', 'IT', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('italy', 'IT', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('italy', 'IT', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('portugal', 'PT', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('portugal', 'PT', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('portugal', 'PT', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('portugal', 'PT', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('portugal', 'PT', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('portugal', 'PT', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('austria', 'AT', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('austria', 'AT', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('austria', 'AT', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('austria', 'AT', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('austria', 'AT', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('austria', 'AT', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('belgium', 'BE', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('belgium', 'BE', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('belgium', 'BE', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('belgium', 'BE', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('belgium', 'BE', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('belgium', 'BE', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('netherlands', 'NL', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('netherlands', 'NL', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('netherlands', 'NL', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('netherlands', 'NL', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('netherlands', 'NL', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('netherlands', 'NL', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('denmark', 'DK', 'DKK',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('denmark', 'DK', 'DKK',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('denmark', 'DK', 'DKK',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('denmark', 'DK', 'DKK',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('denmark', 'DK', 'DKK',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('denmark', 'DK', 'DKK',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('sweden', 'SE', 'SEK',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('sweden', 'SE', 'SEK',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('sweden', 'SE', 'SEK',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('sweden', 'SE', 'SEK',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('sweden', 'SE', 'SEK',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('sweden', 'SE', 'SEK',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('ireland', 'IE', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('ireland', 'IE', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('ireland', 'IE', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('ireland', 'IE', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('ireland', 'IE', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('ireland', 'IE', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('luxembourg', 'LU', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('luxembourg', 'LU', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('luxembourg', 'LU', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('luxembourg', 'LU', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('luxembourg', 'LU', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('luxembourg', 'LU', 'EUR',  6);

INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('finland', 'FI', 'EUR',  1);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('finland', 'FI', 'EUR',  2);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('finland', 'FI', 'EUR',  3);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('finland', 'FI', 'EUR',  4);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('finland', 'FI', 'EUR',  5);
INSERT INTO "country" ("name", "code", "currency", "brand_id") VALUES ('inland', 'FI', 'EUR',  6);

COMMIT;