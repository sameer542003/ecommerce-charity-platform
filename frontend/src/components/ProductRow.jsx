import { Link } from "react-router-dom";

export default function ProductRow({ product }) {
  const finalPrice = (
    product.price - (product.price * (product.discount || 0)) / 100
  ).toFixed(2);

  return (
    <Link
      to={`/products/${product._id}`}
      className="flex items-center gap-4 border-b border-[var(--line)] py-4 hover:bg-[var(--paper-raised)] transition-colors px-2 -mx-2"
    >
      <img
        src={product.image}
        alt={product.title}
        className="h-16 w-16 object-cover border border-[var(--line)] bg-[var(--paper-raised)] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{product.title}</p>
        <p className="text-sm text-[var(--ink-soft)] truncate">
          {product.short_description}
        </p>
        {product.charity_id?.name && (
          <p className="text-xs text-[var(--moss)] mt-0.5">
            supports {product.charity_id.name}
          </p>
        )}
      </div>
      <div className="text-right shrink-0 tabular">
        {product.discount > 0 && (
          <p className="text-xs text-[var(--ink-soft)] line-through">
            ₹{product.price}
          </p>
        )}
        <p className="font-medium">₹{finalPrice}</p>
      </div>
    </Link>
  );
}
