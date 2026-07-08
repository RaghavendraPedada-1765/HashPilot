from fastapi import APIRouter

from app.services.system_service import SystemService

router = APIRouter(
    prefix="/system",
    tags=["System"],
)


@router.get("/")
def system_information():

    return SystemService.get_info()