import { fail, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { prisma } from "$lib/server/prisma"

export const load: PageServerLoad = async () => {
	return {
		articles: await prisma.article.findMany(),
	}
}

export const actions: Actions = {
	createArticle: async ({ request }) => {
		const { title, content } = Object.fromEntries(await request.formData()) as {
			title: string
			content: string
		}

		try {
			await prisma.article.create({
				data: {
					title,
					content,
				},
			})
		} catch (err) {
			console.error(err)
			return fail(500, { message: "Could not create the article." })
		}

		return {
			status: 201,
		}
	},
	deleteArticle: async ({ url }) => {
		const id = Number(url.searchParams.get("id"))

		try {
			await prisma.article.delete({
				where: {
					id,
				},
			})
		} catch (err) {
			console.error(err)
			return fail(500, { message: "Could not delete the article." })
		}

		return {
			status: 200,
		}
	}
}