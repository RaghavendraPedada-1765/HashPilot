from enum import Enum


class EventType(str, Enum):
    STARTED = "started"
    PROGRESS = "progress"
    FINISHED = "finished"
    COMPLETE = "complete"
