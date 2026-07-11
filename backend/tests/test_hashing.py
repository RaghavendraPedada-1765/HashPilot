from app.utils.hashing import sha256


def test_sha256():

    expected = "d770ef93da1c6fa94c0aa3a275cd53de" "4ee1be3e0ec4b06f1bfbae4c6f0c395f"

    assert sha256("HashPilot") == expected
