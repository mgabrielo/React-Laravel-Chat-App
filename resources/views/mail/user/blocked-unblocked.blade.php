<x-mail::message>
    Hello {{ $user->name }},

    @if ($user->blocked_at)
        Your Account Has Been Blocked, You will no longer be able to Log In.
    @else
        Your Account Has Been Activated, You will now be able to Log In.
        <br>
        ***Please Login with this Link***
        <x-mail::button url="{{ route('login') }}">
            Click Here to Login
        </x-mail::button>
    @endif

    Application Reference: {{ config('app.name') }}
</x-mail::message>
