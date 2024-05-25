<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap=false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'email'=>$this->email,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
            'last_message'=>$this->last_message,
            'last_message_date'=>$this->last_message_date,
            'is_admin'=> (bool) $this->is_admin,
            'avatar_url'=> $this->avatar ? Storage::url($this->avatar) : null,
        ];
    }
}
