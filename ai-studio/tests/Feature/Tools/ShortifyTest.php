<?php

namespace Tests\Feature\Tools;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ShortifyTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_returns_clip_for_local_file(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $tmp = tempnam(sys_get_temp_dir(), 'vid');
        $path = $tmp . '.mp4';
        file_put_contents($path, 'fake');
        $response = $this->post('/api/tools/shortify/generate', [
            'source' => $path,
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'ok'])
            ->assertJsonStructure(['clips' => [['url', 'path']]]);
    }
}

