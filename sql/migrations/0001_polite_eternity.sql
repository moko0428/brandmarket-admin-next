ALTER TABLE "stores" ADD COLUMN "branch" text NOT NULL DEFAULT '기본지점';

ALTER TABLE "stores" ALTER COLUMN "address" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "open_time" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "close_time" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "latitude" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "longitude" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "location" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "description" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "store_image" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "stores" ALTER COLUMN "profile_id" SET NOT NULL;
