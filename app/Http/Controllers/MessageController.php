<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Events\SocketMessage;
use App\Http\Resources\MessageResource;
use App\Http\Requests\StoreMessageRequest;
use Illuminate\Support\Facades\Storage;
use App\Models\MessageAttachment;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
      $userId= $user->id;
      $authId=auth()->id();
      $messages=Message::where('sender_id',$authId)
       ->where('receiver_id',$userId )
       ->orWhere('sender_id',$userId )
       ->where('receiver_id',$authId)
       ->latest()
       ->paginate(20);
       return inertia('Home',[
            'selectedConversation'=> $user->toConversationArray(),
            'messages'=> MessageResource::collection($messages),
       ]);
    }

    public function byGroup(Group $group)
    {
       $groupId= $group->id;
       $messages=Message::where('group_id', $groupId)->latest()->paginate(10);
       return inertia('Home',[
        'selectedConversation'=> $group->toConversationArray(),
        'messages'=> MessageResource::collection($messages),
       ]);
    }

    public function loadOlder(Message $message)
    {
        $messages=null;
       if($message->group_id){
        $messages=Message::where('created_at', '<', $message->created_at)
        ->where('group_id', $message->groupId)->latest()->paginate(10);
       }else{
         $messages=Message::where('created_at', '<', $message->created_at)
         ->where(function ($query) use ($message){
            $query->where('sender_id', $message->sender_id)->where('receiver_id', $message->receiver_id)
            ->orWhere('sender_id', $message->receiver_id)->orWhere('receiver_id', $message->sender_id);
         })->latest()->paginate(10);
       }
       return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
       $data= $request->validated();
       $data['sender_id']=auth()->id();
       $receiverId=$data['receiver_id'] ?? null;
       $groupId= $data['group_id'] ?? null;
       $files= $data['attachments'] ?? [];
       $message=  Message::create($data);
       if ($files){
         $attachments = collect(); 
        foreach ($files as $file) {
            $directory= 'attachments/' . Str::random(32);
            Storage::makeDirectory($directory);
            $model =[
                 'message_id'=> $message->id,
                 'name'=> $file->getClientOriginalName(),
                 'mime'=> $file->getClientMimeType(),
                 'size'=> $file->getSize(),
                 'path' => $file->storeAs($directory, $file->getClientOriginalName(), 'public'),
            ];
            $attachment= MessageAttachment::create($model);
            $attachments->push($attachment);
         }
         $message->attachments= $attachments;
       }

       if($receiverId){
        Conversation::updateConversationWIthMessage($receiverId, auth()->id(), $message);
       }
       if($groupId){
        Group::updateGroupWithMessage($groupId, $message);
       }

       SocketMessage::dispatch($message);
       return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
       if($message->sender_id !== auth()->id()){
        return response()->json(['message'=>'Deletion Not Allowed'], 403);
       }
       $group= null;
       $conversation=null;
       $lastmessage=null;
       if($message->group_id){
         $group=Group::where('last_message_id',$message->id)->first();
       }else{
         $conversation =Conversation::where('last_message_id',$message->id)->first();
       }

       $message->delete();
       if($group){
         $group=Group::find($group->id);
         $lastmessage=$group->lastMessage;
      }else if($conversation){
         $conversation=Conversation::find($conversation->id);
          $lastmessage=$conversation->lastMessage;
       }
       return response()->json(['message'=> $lastmessage ?  new MessageResource($lastmessage) :  null]); 
    }
}
