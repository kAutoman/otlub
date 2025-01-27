import { ProductLike } from "@/components/product-like";
import Link from "next/link";
import Image from "next/image";
import { Translate } from "@/components/translate";
import StarIcon from "@/assets/icons/star";
import { Price } from "@/components/price";
import React, { useState } from "react";
import { CartDetailProduct } from "@/types/cart";
import { useCart } from "@/hook/use-cart";
import TrashIcon from "@/assets/icons/trash";
import MessageBubleIcon from "@/assets/icons/message-buble";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import GiftLineIcon from "remixicon-react/GiftLineIcon";
import CartProductCounter from "./cart-product-counter";

const CartProductNote = dynamic(() => import("./cart-product-note"));
const ColorName = dynamic(() => import("@/components/color-name"));

interface CartProductProps {
  data: CartDetailProduct;
  isCalculating?: boolean;
  onCounterClick?: () => void;
  disabled?: boolean;
  showNoteButton?: boolean;
  type?: "authorized" | "unauthorized";
}

const CartProduct = ({
  data,
  onCounterClick,
  isCalculating,
  disabled,
  showNoteButton = true,
  type = "authorized",
}: CartProductProps) => {
  const { t } = useTranslation();
  const { stock, id, galleries } = data;
  const { handleAddToCart, handleDecrement, handleDelete, cartQuantity, isCounterLoading } =
    useCart({
      stockId: stock.id,
      onCounterClick,
      maxQty: stock.product.max_qty,
      minQty: stock.product.min_qty,
      productQty: stock.quantity,
      cartDetailId: id,
    });
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const oldPrice =
    type === "authorized"
      ? (data?.stock?.discount || 0) + (data?.stock?.total_price || 0)
      : (data?.discount || 0) + (data?.total_price || 0);
  return (
    <>
      <div className="flex items-center justify-between pb-7 border-b border-gray-border border-gray-inputBorder relative group">
        <div className="absolute right-0 top-0 rtl:left-0 rtl:right-auto">
          <ProductLike productId={stock.product.id} />
        </div>
        <div className="flex items-center lg:gap-7 md:gap-4 gap-2 h-full flex-1">
          <div className="relative overflow-hidden rounded-3xl h-full aspect-[250/320] md:min-h-[200px] min-h-[160px]">
            {data.bonus && (
              <div className="py-1 absolute top-1 left-1 px-3 rounded-full bg-primary flex  items-center gap-2 text-white z-[1]">
                <GiftLineIcon size={20} />
                <span className="text-sm font-medium text-white">{t("bonus")}</span>
              </div>
            )}
            <Link href={`/products/${stock.product.uuid}?stock_id=${stock.id}`} scroll={false}>
              <Image
                src={galleries?.[0]?.path || stock.product.img}
                alt={stock.product.translation?.title || "product"}
                className="object-cover block  transition-all group-hover:brightness-110"
                fill
              />
            </Link>
          </div>
          <div className="flex-1">
            <Link
              scroll={false}
              href={`/products/${stock.product.uuid}?stock_id=${stock.id}`}
              className="lg:text-[22px] md:text-lg text-base font-medium line-clamp-1 mr-8"
            >
              {stock.product.translation?.title}
            </Link>
            <div className="lg:text-base md:text-sm text-xs text-gray-field  lg:mt-3 flex items-center gap-2 flex-wrap">
              {stock?.extras?.map((extra) => (
                <div key={extra.id} className="flex items-center">
                  <span>{extra.group.translation?.title}</span>:{" "}
                  {extra.group.type === "color" ? (
                    <ColorName color={extra.value.value} />
                  ) : (
                    extra.value.value
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 md:mt-[18px] mt-2">
              <span className="lg:text-base md:text-sm text-xs font-medium">
                <Translate value="reviews" /> ({stock.product.r_count || 0})
              </span>
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="lg:text-base md:text-sm text-xs font-semibold">
                  {stock.product.r_avg || 0}
                </span>
              </div>
            </div>
            <div className="text-xs font-medium mt-3">
              {t("sku")}: {stock.sku}
            </div>
            <div className="flex flex-1 justify-between items-center lg:gap-7 md:gap-4 gap-2 lgmt-7 flex-wrap">
              <div className="flex items-start gap-2">
                <strong className="lg:text-[28px] md:text-2xl text-lg font-bold">
                  <Price
                    number={
                      data.total_price ??
                      (data.discount && data.price && data.discount > 0
                        ? data.price - data.discount
                        : data.price)
                    }
                  />
                </strong>
                {!!data.discount && data.discount > 0 && (
                  <span className="text-primary text-xl font-semibold line-through">
                    <Price number={oldPrice} />
                  </span>
                )}
              </div>

              {!data.bonus && (
                <div className="flex items-center lg:gap-10 md:gap-6 gap-4">
                  <CartProductCounter
                    minQty={stock.product.min_qty}
                    onMinusClick={() => handleDecrement()}
                    onPlusClick={() => handleAddToCart()}
                    count={cartQuantity || data.quantity}
                    isCounterLoading={isCounterLoading || Boolean(isCalculating)}
                    interval={data.stock?.product?.interval}
                    disabled={disabled}
                  />
                  {!disabled && (
                    <div className="flex items-center gap-2">
                      {showNoteButton && (
                        <button
                          onClick={() => setIsNoteModalOpen(true)}
                          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-faq hover:brightness-90 transition-all"
                        >
                          <MessageBubleIcon />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete()}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-faq dark:text-dark hover:brightness-90 transition-all"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>
              )}
              {data.bonus && (
                <span className="text-sm">
                  {t("quantity")}: {data.quantity}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal withCloseButton onClose={() => setIsNoteModalOpen(false)} isOpen={isNoteModalOpen}>
        <CartProductNote onSave={() => setIsNoteModalOpen(false)} data={data} />
      </Modal>
    </>
  );
};

export default CartProduct;
