BEGIN;

CREATE TABLE file_info(
 vol_path TEXT,
 parent_path TEXT,
 share_name TEXT,
 name TEXT,
 is_dir NUMERIC,
 path TEXT,
 file_ext TEXT,
 size NUMERIC,
 time_change NUMERIC,
 time_create NUMERIC,
 time_access NUMERIC,
 time_modify NUMERIC,
 privilege TEXT,
 mode NUMERIC,
 uid NUMERIC,
 gid NUMERIC,
 owner_name TEXT,
 group_name TEXT,
 search_name TEXT
);

COMMIT;

