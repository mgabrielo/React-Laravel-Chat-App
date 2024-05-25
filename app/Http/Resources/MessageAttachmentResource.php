<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageAttachmentResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'message_id'=>$this->message_id,
            'name'=>$this->name,
            'size'=>$this->size,
            'mime'=>$this->mime,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
            'url'=>Storage::url($this->path),
        ];
    }
}
