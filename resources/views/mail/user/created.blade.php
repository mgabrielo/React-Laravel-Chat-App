<x-mail::message>
    Hello {{ $user->name }},
    Your Account Has Been Created Succesfully...!!!
    <br>
    ***Here is Your Login Info***
    <br>
    Email: {{ $user->email }}
    Password: {{ $password }}

    ***Please Login in to Change Your Details***
    <x-mail::button url="{{ route('login') }}">
        Click Here to Login
    </x-mail::button>
    <br>
    Thank You {{ $user->name }}
    <br>
    Application Reference : {{ config('app.name') }}
</x-mail::message>
