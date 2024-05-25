<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Group;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create two specific users
        User::factory()->create([
            'name' => 'Test1',
            'email' => 'test1@email.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);
        User::factory()->create([
            'name' => 'Test2',
            'email' => 'test2@email.com',
            'password' => bcrypt('password'),
        ]);

        // Create 10 random users
        User::factory(10)->create();

        // Create groups and attach users to each group
        for ($i = 0; $i < 10; $i++) { 
            $group = Group::factory()->create([
                'owner_id' => 1,
            ]);
            $users = User::inRandomOrder()->limit(rand(2, 10))->pluck('id');
            $group->users()->attach(array_unique([1,...$users]));
        }

        // Create 1000 messages
        Message::factory(1000)->create();

        // Retrieve messages without group_id and organize conversations
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function ($groupMessages) {
            return [
                'user_id1' => $groupMessages->first()->sender_id,
                'user_id2' => $groupMessages->first()->receiver_id,
                'last_message_id' => $groupMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
