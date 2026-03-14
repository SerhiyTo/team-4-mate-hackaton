from fastapi import Form
from pydantic import BaseModel


class DataParam(BaseModel):
    body_height: int
    body_waist: int
    body_shoulder_width: int
    body_arm_length: int
    cloth_length: int
    cloth_waist: int
    cloth_shoulder_width: int
    cloth_sleeve_length: int

    @classmethod
    def as_form(
        cls,
        body_height: int = Form(...),
        body_waist: int = Form(...),
        body_shoulder_width: int = Form(...),
        body_arm_length: int = Form(...),
        cloth_length: int = Form(...),
        cloth_waist: int = Form(...),
        cloth_shoulder_width: int = Form(...),
        cloth_sleeve_length: int = Form(...)
    ):
        return cls(
            body_height=body_height,
            body_waist=body_waist,
            body_shoulder_width=body_shoulder_width,
            body_arm_length=body_arm_length,
            cloth_length=cloth_length,
            cloth_waist=cloth_waist,
            cloth_shoulder_width=cloth_shoulder_width,
            cloth_sleeve_length=cloth_sleeve_length
        )
