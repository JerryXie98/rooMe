CREATE TABLE request (
    name                    VARCHAR(50),
    phone                   BIGINT,
    type                    VARCHAR(50),        
    distance                NUMERIC,          -- distance willing to travel
    lat                     NUMERIC,          
    lng                     NUMERIC
);

-- Pizza Nova
INSERT INTO request (name, phone, type, distance, lat, lng)
VALUES ('Joey Ho', 1111111111, 'restaurant', 2000, 43.46988, -80.534309);

-- Paninos
INSERT INTO request (name, phone, type, distance, lat, lng)
VALUES ('Jason Ho', 2222222222, 'cafe', 2000, 43.4721463,-80.5389807);

-- Mels
INSERT INTO request (name, phone, type, distance, lat, lng)
VALUES ('Jerry Xie', 3333333333, 'restaurant', 2000, 43.4721925,-80.5370016);

-- Kick Off
INSERT INTO request (name, phone, type, distance, lat, lng)
VALUES ('Richard Ma', 4444444444, 'bar', 2000, 43.4723488,-80.5376904);

-- Subway
INSERT INTO request (name, phone, type, distance, lat, lng)
VALUES ('Tanay Desai', 5555555555, 'takeout', 2000, 43.4641124,-80.522667);

-- COCO
INSERT INTO request (name, phone, type, distance, lat, lng)
VALUES ('Jiwan Kang', 8888888888, 'takeout', 2000, 43.4726483,-80.5361999);
