from omniforge.modules.toolbox.core import convert_units

def run(args):
    val_str = args.get("input", "1.0").strip()
    try:
        val = float(val_str) if val_str else 1.0
        from_u = args.get("from", "m")
        to_u = args.get("to", "km")
        cat = args.get("category", "length")
        result = convert_units(val, from_u, to_u, cat)
        return {"result": f"{val} {from_u} = {result} {to_u}"}
    except Exception as e:
        return {"error": str(e)}
