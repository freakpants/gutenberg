/**
 * WordPress dependencies
 */
import {
	createNewPost,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

// Avoid using three, as it looks too much like two with some fonts.
const ARABIC_ZERO = '٠';
const ARABIC_ONE = '١';
const ARABIC_TWO = '٢';

describe( 'RTL', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should arrow navigate', async () => {
		await page.evaluate( () => document.dir = 'rtl' );
		await page.keyboard.press( 'Enter' );

		// We need at least three characters as arrow navigation *from* the
		// edges might be handled differently.
		await page.keyboard.type( ARABIC_ONE );
		await page.keyboard.type( ARABIC_TWO );
		await page.keyboard.press( 'ArrowRight' );
		// This is the important key press: arrow nav *from* the middle.
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.type( ARABIC_ZERO );

		// Expect: ARABIC_ZERO + ARABIC_ONE + ARABIC_TWO (<p>٠١٢</p>).
		// N.b.: HTML is LTR, so direction will be reversed!
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should split', async () => {
		await page.evaluate( () => document.dir = 'rtl' );
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( ARABIC_ZERO );
		await page.keyboard.type( ARABIC_ONE );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Enter' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should merge backward', async () => {
		await page.evaluate( () => document.dir = 'rtl' );
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( ARABIC_ZERO );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( ARABIC_ONE );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Backspace' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should merge forward', async () => {
		await page.evaluate( () => document.dir = 'rtl' );
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( ARABIC_ZERO );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( ARABIC_ONE );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Delete' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );
