<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\UserCreated;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\UserRoleChanged;
use App\Mail\UserBlockedUnblocked;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function store(Request $request){
        $data=$request->validate([
            'name'=>['required','string'],
            'email'=>['required','email','unique:users,email'],
            'is_admin'=>'boolean',
        ]);
        $rawPassword=Str::random(8);
        // $rawPassword='password';
        $data['password']=bcrypt($rawPassword);
        $data['email_verified_at']=now();
         $user=User::create($data);
         Mail::to($user)->send(new UserCreated($user,$rawPassword));
        return redirect()->back();
    }

    public function changeRole(User $user){
        $user->update(['is_admin'=>!(bool) $user->is_admin]);
        $message='User Status was changed to'.($user->is_admin ? '"Admin"': '"Regular User"');
        Mail::to($user)->send(new UserRoleChanged($user));
        return response()->json(['message'=>$message]);
    }

    public function blockUnblock(User $user){
        if($user->blocked_at){
            $user->blocked_at=null;
            $message= 'User Account '.$user->name.' is now activated';
        }else{
            $user->blocked_at=now();
            $message= 'User Account '.$user->name.' is now deactivated or blocked';
        }
        $user->save();
        Mail::to($user)->send(new UserBlockedUnblocked($user));
        return response()->json(['message'=>$message]);
    }
}
