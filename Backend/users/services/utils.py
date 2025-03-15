from time import sleep

from rest_framework_simplejwt.tokens import RefreshToken

from .responses import deny_access_response


def request_delay(ip, redis_db):
    EXPIRY_ATTEMPTS = 30  # seconds
    attempts = redis_db.get(f"failed_attempts: {ip}")
    attempts = 0 if not (attempts) else int(attempts)
    missing_expiration_time = redis_db.ttl(f"failed_attempts: {ip}")

    # Rate limit
    if attempts >= 5 and missing_expiration_time > 0:
        return deny_access_response()

    sleep(attempts * 1.5)
    redis_db.setex(f"failed_attempts: {ip}", EXPIRY_ATTEMPTS, attempts + 1)


def generate_tokens(user):
    refresh_token = RefreshToken.for_user(user)
    access_token = refresh_token.access_token

    # Here you can add custom claims or attributes

    return (refresh_token, access_token)
