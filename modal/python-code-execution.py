import modal
from typing import List
from pydantic import BaseModel
import time

stub = modal.Stub("python-code-execution")
image = modal.Image.debian_slim().pip_install("RestrictedPython")


@stub.function(image=image, timeout=10)
def run_code(code: str, args: list):
    # from RestrictedPython import compile_restricted

    # byte_code = compile_restricted(code, filename="main.py", mode="exec")
    scope = {}
    exec(code, None, scope)

    start_time = time.time()

    result = None

    try:
        ret = scope["solution"](*args)
        end_time = time.time()

        result = {"status": "success", "result": ret}

    except Exception as e:
        end_time = time.time()
        result = {
            "status": "error",
            "reason": {"name": type(e).__name__, "message": str(e)},
        }

    result["time"] = end_time - start_time

    return result


class RequestBody(BaseModel):
    code: str
    args_list: List[List]


@stub.function()
@modal.web_endpoint(method="POST", label="run-code")
def endpoint(item: RequestBody):
    run_code_args = ((item.code, args) for args in item.args_list)
    results = list(run_code.starmap(run_code_args, return_exceptions=True))

    return {
        "results": results,
        "total_time": sum(result["time"] for result in results),
    }


@stub.local_entrypoint()
def main():
    code = """
def solution(numbers, target):
    while True:
        pass
    return target < sum(numbers)
"""

    args_list = [
        [[1, 2, 3], 10],
        [[1, 2, 3], 5],
    ]

    run_code_args = ((code, args) for args in args_list)
    results = list(run_code.starmap(run_code_args, return_exceptions=True))

    print(results)
