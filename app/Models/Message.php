<?php

namespace App\Models;

use App\Models\User;
use App\Models\Group;
use App\Models\MessageAttachment;
use App\Observers\MessageObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([MessageObserver::class])]
class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'message',
        'group_id',
        'receiver_id',
    ];

    protected function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    protected function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    protected function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }
}
