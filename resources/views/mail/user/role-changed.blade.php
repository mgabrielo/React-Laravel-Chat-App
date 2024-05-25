<x-mail::message>
    Hello {{ $user->name }},

    Your role has been changed to {{ $user->is_admin ? 'Admin' : 'Regular User' }}.

    Application Reference: {{ config('app.name') }}
</x-mail::message>
