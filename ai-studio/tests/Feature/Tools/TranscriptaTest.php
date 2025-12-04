<?php

namespace Tests\Feature\Tools;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use App\Models\User;

class TranscriptaTest extends TestCase
{
    use RefreshDatabase;

    public function test_process_creates_transcript_and_returns_text(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $file = UploadedFile::fake()->create('sample.mp3', 10, 'audio/mpeg');
        $response = $this->post('/api/tools/transcripta/process', [
            'file' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['transcript' => ['id', 'user_id', 'input_path', 'text', 'created_at', 'updated_at']])
            ->assertJsonPath('transcript.user_id', $user->id);

        $history = $this->get('/api/tools/transcripta/history');
        $history->assertStatus(200)
            ->assertJsonStructure(['history']);
    }
}

