import connectDB from '../DB/connection.js'
import cors from 'cors'
import authRouter from './modules/auth/auth.router.js'
import branRouter from './modules/brand/brand.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import productRouter from './modules/product/product.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import userRouter from './modules/user/user.router.js'
import favorite from './modules/favorite/favorite.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'
import morgan from 'morgan'
import cors from 'cors'
import chalk from 'chalk'



const initApp = (app, express) => {
    app.use(morgan('tiny'))
    app.use(cors())
    
    //convert Buffer Data
    app.use((req, res, next) =>{
        if(req.originalUrl== '/order/webhook'){
           next()
        }else{
            express.json()(req, res, next)
        }
    })
    
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/product`, productRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/subCategory`, subcategoryRouter)
    app.use(`/review`, reviewsRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)
    app.use(`/brand`, branRouter)
    app.use(`/favourite`, favorite)

   


    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })

    app.use( globalErrorHandling)

    connectDB()

}



export default initApp