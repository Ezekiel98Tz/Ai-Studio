<?php

namespace Tests\Feature\Tools;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class BackgroundZapTest extends TestCase
{
    use RefreshDatabase;

    public function test_remove_background_returns_output_for_local_file(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $tmp = tempnam(sys_get_temp_dir(), 'img');
        $path = $tmp . '.png';
        // 1x1 transparent PNG
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');
        file_put_contents($path, $png);
        $response = $this->post('/api/tools/backgroundzap/remove', [
            'image' => $path,
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'ok'])
            ->assertJsonStructure(['url', 'output_path']);
    }
}

