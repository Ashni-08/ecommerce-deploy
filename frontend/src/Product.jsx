import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Style.css'
import StatusButton from './StatusButton'
import BuynowBtn from './BuynowBtn'
import Navbar from './Navbar'
import InsaneFluidCursor from './InsaneFluidCursor'
import { CartContext } from './CartContext'

import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import StarIcon from '@mui/icons-material/Star'
import Typography from '@mui/material/Typography'

const labels = {
  0.5: 'Useless', 1: 'Useless+', 1.5: 'Poor', 2: 'Poor+',
  2.5: 'Ok', 3: 'Ok+', 3.5: 'Good', 4: 'Good+',
  4.5: 'Excellent', 5: 'Excellent+',
}

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`
}

function YourRating() {
  const [value, setValue] = useState(null)
  const [hover, setHover] = useState(-1)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mt: '6px' }}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
        Your Rating
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Rating
          name="user-rating"
          value={value}
          precision={0.5}
          getLabelText={getLabelText}
          onChange={(_, newValue) => setValue(newValue)}
          onChangeActive={(_, newHover) => setHover(newHover)}
          emptyIcon={<StarIcon style={{ opacity: 0.35, color: '#fff' }} fontSize="inherit" />}
          sx={{
            fontSize: '1.6rem',
            '& .MuiRating-iconFilled': { color: '#ffd055' },
            '& .MuiRating-iconHover': { color: '#ffe585' },
          }}
        />

        {value !== null && (
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#00e0c0' }}>
            {labels[hover !== -1 ? hover : value]}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

function QuantitySelector({ quantity, setQuantity, maxStock }) {
  return (
    <div className="quantity-selector">
      <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
      <span className="qty-value">{quantity}</span>
      <button
        className="qty-btn"
        onClick={() =>
          setQuantity(q =>
            maxStock !== 'N/A' ? Math.min(maxStock, q + 1) : q + 1
          )
        }
      >+</button>
    </div>
  )
}

function Product() {

  const { id, source } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const normalizeProduct = (p, src) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    image: p.thumbnail || p.images?.[0] || p.image,
    images: p.images || [p.thumbnail || p.image],
    rating: src === 'fake' ? p.rating?.rate : p.rating,
    stock: p.stock ?? 'N/A',
    brand: p.brand ?? 'N/A',
    category: p.category,
  })

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product)
    alert(`${product.title} added to cart ✅`)
  }

  useEffect(() => {
    setLoading(true)
    setImgError(false)
    setQuantity(1)

    let url = ''
    if (source === 'dummy') url = `https://dummyjson.com/products/${id}`
    else if (source === 'fake') url = `https://fakestoreapi.com/products/${id}`
    else if (source === 'local') url = `https://ecommerce-deploy-production.up.railway.app/api/products/${id}`
    else { setLoading(false); return }

    axios.get(url)
      .then((res) => {
        const normalized = normalizeProduct(res.data, source)
        setProduct(normalized)
        setSelectedImg(normalized.images[0])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id, source])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div>Loading...</div>
  if (!product) return <div>No product found</div>

  return (
    <div className="product-page">
      <InsaneFluidCursor />
      <Navbar />

      <div className="product-wrapper">
        <div className="product-content">

          <div className="product-left-col">

            <div className="product-image-card">
              {!imgError ? (
                <img
                  src={selectedImg}
                  alt={product.title}
                  className="product-image"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="product-image-fallback">
                  <span style={{ fontSize: '3rem' }}>🛍️</span>
                  <p>No Image</p>
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="image-selector">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`image-thumb-btn ${selectedImg === img ? 'active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                  >
                    <img src={img} alt={`thumb-${index}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="product-actions-row">
              <button className={`action-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={() => setWishlisted(w => !w)}>
                {wishlisted ? '❤️' : '🤍'}
              </button>

              <button className="action-btn" onClick={handleShare}>
                {copied ? '✅ Copied!' : '🔗 Share'}
              </button>
            </div>

          </div>

          <div className="product-box">
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>

            <YourRating />

            <div className="btn-box">
              <BuynowBtn product={product} quantity={quantity} />
              <div onClick={handleAddToCart}>
                <StatusButton product={product} quantity={quantity} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Product