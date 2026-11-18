package com.sportcycle;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.output.MigrateResult;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

public class MigrateSupabaseTest {

    @Test
    @Disabled("Manual utility: run to apply migrations to live Supabase database")
    void runMigration() {
        String url = System.getenv().getOrDefault(
                "DATABASE_URL",
                "jdbc:postgresql://db.afxpqhfbisswvuxktklk.supabase.co:5432/postgres?sslmode=require"
        );
        String user = System.getenv().getOrDefault("DATABASE_USERNAME", "postgres");
        String password = System.getenv().getOrDefault("DATABASE_PASSWORD", "SKkabaddi63@");

        System.out.println("Starting Flyway migration on Supabase: " + url);

        Flyway flyway = Flyway.configure()
                .dataSource(url, user, password)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();

        MigrateResult result = flyway.migrate();
        System.out.println("FLYWAY SUCCESS: Migrations executed = " + result.migrationsExecuted);
        System.out.println("Target schema version = " + result.targetSchemaVersion);
    }
}
