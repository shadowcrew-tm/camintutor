-- Drop existing tables in reverse order to avoid FK constraints
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Rooms;
DROP TABLE IF EXISTS Dorm_Faculties;
DROP TABLE IF EXISTS Dorms;
DROP TABLE IF EXISTS Faculties;
DROP TABLE IF EXISTS Universities;
DROP TABLE IF EXISTS Users;

-- Ensure uuid extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'))
);

-- 2. Universities Table
CREATE TABLE Universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 3. Faculties Table
CREATE TABLE Faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES Universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    UNIQUE(university_id, name)
);

-- 4. Dorms Table
CREATE TABLE Dorms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    description TEXT,
    pictures TEXT[],
    tips TEXT
);

-- 5. Dorm_Faculties Join Table
CREATE TABLE Dorm_Faculties (
    dorm_id UUID NOT NULL REFERENCES Dorms(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES Faculties(id) ON DELETE CASCADE,
    PRIMARY KEY (dorm_id, faculty_id)
);

-- 6. Rooms Table
CREATE TABLE Rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dorm_id UUID NOT NULL REFERENCES Dorms(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked', 'maintenance'))
);

-- 7. Bookings Table
CREATE TABLE Bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES Rooms(id) ON DELETE CASCADE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Reviews Table
CREATE TABLE Reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dorm_id UUID NOT NULL REFERENCES Dorms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dorm_id, user_id)
);

---------------------------------------------------
-- INSERT DATA
---------------------------------------------------

-- Universities
INSERT INTO Universities (name) VALUES
('Universitatea de Vest din Timisoara (UVT)'),
('Universitatea Politehnica Timisoara (UPT)'),
('Universitatea de Medicina si Farmacie "Victor Babes" Timisoara (UMFT)');

-- Faculties for UVT
INSERT INTO Faculties (university_id, name) VALUES
((SELECT id FROM Universities WHERE name = 'Universitatea de Vest din Timisoara (UVT)'), 'Facultatea de Informatica'),
((SELECT id FROM Universities WHERE name = 'Universitatea de Vest din Timisoara (UVT)'), 'Facultatea de Matematica si Fizica');

-- Faculties for UPT
INSERT INTO Faculties (university_id, name) VALUES
((SELECT id FROM Universities WHERE name = 'Universitatea Politehnica Timisoara (UPT)'), 'Facultatea de Automatica si Calculatoare'),
((SELECT id FROM Universities WHERE name = 'Universitatea Politehnica Timisoara (UPT)'), 'Facultatea de Electronica, Telecomunicatii si Tehnologii Informationale');

-- Faculties for UMFT
INSERT INTO Faculties (university_id, name) VALUES
((SELECT id FROM Universities WHERE name = 'Universitatea de Medicina si Farmacie "Victor Babes" Timisoara (UMFT)'), 'Facultatea de Medicina'),
((SELECT id FROM Universities WHERE name = 'Universitatea de Medicina si Farmacie "Victor Babes" Timisoara (UMFT)'), 'Facultatea de Farmacie');

-- Dorms
INSERT INTO Dorms (name, address, description, tips) VALUES
('Caminul C17', 'Complex Studentesc', 'Conditii decente, 5 persoane/camera', 'Aproape de UVT'),
('Caminul C16', 'Complex Studentesc', 'Conditii decente, 4 persoane/camera', 'Aproape de UVT'),
('Caminul C13', 'Complex Studentesc', 'Conditii decente, 2 persoane/camera', 'Aproape de UVT'),
('Caminul 19C', 'Complex Studentesc', 'Conditii decente, 4 persoane/camera', 'Aproape de UPT'),
('Caminul 1C', 'Complex Studentesc', 'Conditii decente, 4 persoane/camera', 'Aproape de UPT'),
('Caminul 18', 'Complex Studentesc', 'Conditii decente, 2 persoane/camera', 'Aproape de Centru'),
('Caminul C1-2', 'Regimentului 13', 'Conditii decente, 3 persoane/camera', 'Langa UMFT');

-- Dorm-Faculty relations
INSERT INTO Dorm_Faculties (dorm_id, faculty_id) VALUES
((SELECT id FROM Dorms WHERE name = 'Caminul C17'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Informatica')),
((SELECT id FROM Dorms WHERE name = 'Caminul C16'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Informatica')),
((SELECT id FROM Dorms WHERE name = 'Caminul C13'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Matematica si Fizica')),
((SELECT id FROM Dorms WHERE name = 'Caminul 19C'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Automatica si Calculatoare')),
((SELECT id FROM Dorms WHERE name = 'Caminul 1C'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Electronica, Telecomunicatii si Tehnologii Informationale')),
((SELECT id FROM Dorms WHERE name = 'Caminul 18'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Medicina')),
((SELECT id FROM Dorms WHERE name = 'Caminul C1-2'), (SELECT id FROM Faculties WHERE name = 'Facultatea de Farmacie'));
