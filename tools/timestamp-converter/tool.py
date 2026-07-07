from omniforge.modules.toolbox.core import unix_to_human, human_to_unix, now_unix

def run(args):
    op = args.get("op", "now")
    val = args.get("input", "").strip()
    try:
        if op == "unix_to_human":
            ts = int(val) if val else now_unix()
            return {"result": unix_to_human(ts)}
        elif op == "human_to_unix":
            return {"result": str(human_to_unix(val))}
        return {"result": str(now_unix())}
    except Exception as e:
        return {"error": str(e)}
