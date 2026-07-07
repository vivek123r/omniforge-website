from omniforge.modules.toolbox.core import hex_to_rgb, rgb_to_hex, rgb_to_hsl, hsl_to_rgb

def run(args):
    op = args.get("op", "hex_to_rgb")
    val = args.get("input", "").strip()
    try:
        if op == "hex_to_rgb":
            rgb = hex_to_rgb(val if val else "#ffffff")
            return {"result": f"RGB: r={rgb['r']}, g={rgb['g']}, b={rgb['b']}"}
        elif op == "rgb_to_hex":
            # parse e.g. "255, 255, 255"
            parts = [int(x.strip()) for x in val.split(",") if x.strip()]
            r = parts[0] if len(parts) > 0 else 255
            g = parts[1] if len(parts) > 1 else 255
            b = parts[2] if len(parts) > 2 else 255
            return {"result": rgb_to_hex(r, g, b)}
        return {"result": "Invalid operation"}
    except Exception as e:
        return {"error": str(e)}
