/*
# Create increment_hearts function

## Overview
Creates a SECURITY DEFINER function to atomically increment the hearts count
on a community post. This avoids race conditions when multiple users heart
the same post simultaneously.

## New Functions
- increment_hearts(post_id uuid) — increments hearts by 1 for the given post

## Security
- SECURITY DEFINER so it runs with the table owner's privileges
- The function only updates the hearts column, nothing else
*/

CREATE OR REPLACE FUNCTION increment_hearts(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE community_posts
  SET hearts = hearts + 1
  WHERE id = post_id;
END;
$$;