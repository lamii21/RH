-- SQL Migration Script: Add Indexes for Performance
-- Run this script in your PostgreSQL database (e.g., via psql or pgAdmin)

-- Indexes for Leave tracking
CREATE INDEX IF NOT EXISTS idx_leaves_employee_id ON leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_leaves_dates ON leaves(start_date, end_date);

-- Indexes for Attendance tracking
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Indexes for Documents
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);
