CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."media_types" AS ENUM('image', 'video', 'pdf', 'docx');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'author');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" text,
	"facebook_url" text,
	"linkedin_url" text,
	"youtube_url" text,
	"instagram_url" text,
	"twitter_url" text,
	"tiktok_url" text,
	CONSTRAINT "authors_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"thumbnail" uuid,
	"author_id" uuid NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"meta_title" varchar(255),
	"meta_description" varchar(300),
	"canonical_url" varchar(500),
	"og_title" varchar(255),
	"og_description" varchar(300),
	"schema" text,
	"redirect_url" text
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"url" text NOT NULL,
	"alt" varchar(300) NOT NULL,
	"title" varchar(300) NOT NULL,
	"type" "media_types" DEFAULT 'image' NOT NULL,
	"caption" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"role" "user_role" DEFAULT 'author' NOT NULL,
	"avatar" uuid,
	CONSTRAINT "users_name_length_check" CHECK (length(trim("users"."name")) >= 2),
	CONSTRAINT "users_email_length_check" CHECK (length(trim("users"."email")) >= 5),
	CONSTRAINT "users_password_hash_length_check" CHECK (length() >= 20)
);
--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_thumbnail_media_id_fk" FOREIGN KEY ("thumbnail") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_media_id_fk" FOREIGN KEY ("avatar") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blogs_slug_unique" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blogs_author_id_idx" ON "blogs" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "blogs_status_idx" ON "blogs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");