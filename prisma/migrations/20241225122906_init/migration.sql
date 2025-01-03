-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "system_key" TEXT NOT NULL,
    "vendor_name" TEXT,
    "vendor_code" TEXT,
    "year" TEXT,
    "scope_of_work" TEXT,
    "ran_score" TEXT,
    "unique_id" TEXT,
    "site_id" TEXT,
    "site_name" TEXT,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "site_type" TEXT,
    "dati_ii" TEXT,
    "province" TEXT,
    "mc_cluster" TEXT,
    "caf_approved" TIMESTAMP(3),
    "site_status" TEXT,
    "cutover_bf" TIMESTAMP(3),
    "cutover_ff" TIMESTAMP(3),
    "cutover_af" TIMESTAMP(3),
    "survey_ff" TIMESTAMP(3),
    "survey_af" TIMESTAMP(3),
    "caf_status" TEXT,
    "caf_submitted" TIMESTAMP(3),
    "mos_af" TIMESTAMP(3),
    "mos_bf" TIMESTAMP(3),
    "mos_ff" TIMESTAMP(3),
    "ic_000040_af" TIMESTAMP(3),
    "ic_000040_bf" TIMESTAMP(3),
    "ic_000040_ff" TIMESTAMP(3),
    "imp_integ_af" TIMESTAMP(3),
    "imp_integ_bf" TIMESTAMP(3),
    "imp_integ_ff" TIMESTAMP(3),
    "rfs_af" TIMESTAMP(3),
    "rfs_ff" TIMESTAMP(3),
    "rfs_bf" TIMESTAMP(3),
    "nano_cluster" TEXT,
    "scope_category" TEXT,
    "ran_scope" TEXT,
    "site_dismantle_af" TIMESTAMP(3),
    "site_dismantle_bf" TIMESTAMP(3),
    "site_dismantle_ff" TIMESTAMP(3),
    "site_trm_type" TEXT,
    "summary_scope" TEXT,
    "cx_post_mr_af" TEXT,
    "cx_post_mr_ff" TEXT,
    "swap_time" TEXT,
    "downtime_actual" TEXT,
    "area_spider" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_system_key_key" ON "Site"("system_key");
