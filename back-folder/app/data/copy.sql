COPY coupon (code, amount, status, country_id)
FROM '/Users/jean-baptistebayaut/Desktop/boardriders/foc-api/app/data/FOC100_ok.csv'
DELIMITER ',' 
CSV HEADER;