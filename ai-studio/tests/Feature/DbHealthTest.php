<?php

namespace Tests\Feature;

use Tests\TestCase;

class DbHealthTest extends TestCase
{
    public function test_db_health_ok(): void
    {
        $res = $this->get('/api/db-health');
        $res->assertStatus(200)
            ->assertJson(['status' => 'ok']);
    }
}

