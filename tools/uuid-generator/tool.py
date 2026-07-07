from omniforge.modules.toolbox.core import generate_uuid_batch

def run(args):
    count = int(args.get("count", 5))
    version = int(args.get("version", 4))
    try:
        uuids = generate_uuid_batch(count, version)
        return {"result": "\n".join(uuids)}
    except Exception as e:
        return {"error": str(e)}
